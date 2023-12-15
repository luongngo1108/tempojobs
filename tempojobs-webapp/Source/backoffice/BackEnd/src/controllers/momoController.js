import crypto from 'crypto'
import https from 'https'
import { ReturnResult } from '../DTO/returnResult.js';
import Work from "../models/workModel.js";
import PaymentHistory from "../models/paymentHistoryModel.js";
import User from "../models/userModel.js";
import { PagedData } from '../models/pageModel.js';
import PaymentType from '../DTO/enums/paymentType.js';

class momoController {
    async createMomoPayment(req, res, next) {
        var result = new ReturnResult();
        try {
            const { inputAmount, workId, userEmail, paymentType, extendDay } = req.body;
            console.log("paymentType ne",paymentType)
            var userId = null;
            var user = null;
            if (userEmail) user = await User.findOne({ email: userEmail });
            userId = user._id
            //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
            //parameters
            var partnerCode = "MOMO";
            var accessKey = "F8BBA842ECF85";
            var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            var paymentToken = new Date().getTime() + crypto.randomBytes(32).toString("hex");
            var requestId = partnerCode + paymentToken;
            var orderId = requestId;
            var orderInfo = "Thanh toán bằng MOMO";
            var redirectUrl = userId ? `http://localhost:4200/created-manage?userId=${userId}&paymentToken=${paymentToken}&paymentType=${paymentType}&extendDay=${extendDay}`
                : `http://localhost:4200/created-manage?paymentToken=${paymentToken}&paymentType=${paymentType}`;
            var ipnUrl = "https://callback.url/notify";
            // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            var amount = `${inputAmount}`;
            var requestType = "captureWallet"
            var extraData = ""; //pass empty value if your merchant does not have stores
            // Save orderId into work
            var updatedWork = await Work.findOneAndUpdate({ workId: workId }, { paymentToken: paymentToken }, { returnOriginal: false });
            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" 
                            + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" 
                            + requestId + "&requestType=" + requestType
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //signature

            var signature = crypto.createHmac('sha256', secretkey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: 'en'
            });
            //Create the HTTPS objects

            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //Send the request and get the response
            const reqMomo = https.request(options, response => {
                console.log(`Status: ${response.statusCode}`);
                console.log(`Headers: ${JSON.stringify(response.headers)}`);
                response.setEncoding('utf8');
                response.on('data', (body) => {
                    console.log('Body: ');
                    console.log(body);
                    console.log('payUrl: ');
                    console.log(JSON.parse(body).payUrl);
                    result.result = JSON.parse(body).payUrl;
                    res.status(200).json(result);
                });
                response.on('end', () => {
                    console.log('No more data in response.');
                });
            })

            reqMomo.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                res.status(200).json(result);
            });
            // write data to request body
            console.log("Sending....")
            reqMomo.write(requestBody);
            reqMomo.end();
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    async momoPayementSuccess(req, res, next) {
        var result = new ReturnResult();
        try {
            const { paymentToken, amount, userId, paymentType, extendDay } = req.body;
            var updateValues = null;
            if(paymentType == PaymentType.ExtendWork) {
                updateValues = { workStatusId: 2, paymentToken: "", startDate: extendDay }
            } 
            if(paymentType == PaymentType.PayForWork) {
                updateValues = { workStatusId: 2, paymentToken: ""}
            }
            if(updateValues) {
                switch (paymentType) {
                    case PaymentType.PayForWork:
                        updateValues.paymentType = PaymentType.PayForWork;
                        break;
                    case PaymentType.ExtendWork:
                        updateValues.paymentType = PaymentType.ExtendWork;
                        break;
                }
                const updatedWork = await Work.findOneAndUpdate({ paymentToken: paymentToken }, updateValues, { returnOriginal: false });
                if (updatedWork) {
                    const savedPaymentHistory = await PaymentHistory.create({
                        payerId: userId,
                        workId: updatedWork.workId,
                        amount: amount,
                        paymentType: paymentType
                    });
                    if (savedPaymentHistory) result.result = true;
                }
            }
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }
    async getPaymentHistoryByUserId(req, res, next) {
        var result = new ReturnResult();
        try {
            let userId = req.params.userId;
            let paymentHistories;
            if (userId) paymentHistories = await PaymentHistory.find({ payerId: userId });
            if (paymentHistories) {
                result.result = paymentHistories;
            }
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }

    async getAllPayment(req, res, next) {
        var result = new PagedData();
        try {
            var paymentHistories = await PaymentHistory.find();
            if(paymentHistories && paymentHistories.length > 0) {
                for(var payment of paymentHistories) {
                    var foundUser = await User.findById(payment.payerId);
                    if(foundUser) payment.payerName = foundUser.displayName;
                }
            }
            result.data = paymentHistories;
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }
}

export default new momoController;