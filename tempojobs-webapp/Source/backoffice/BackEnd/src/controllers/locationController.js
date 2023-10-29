import { ReturnResult } from '../DTO/returnResult.js';
import GoogleMapLocation from '../models/googleMapLocationModel.js'

class LocationController {
    async saveGoogleMapLocation(req, res, next) {
        var result = new ReturnResult();
        try {
            const googleLocation = req.body;
            const updatedLocation = await GoogleMapLocation.findByIdAndUpdate(googleLocation._id, googleLocation, {returnOriginal: false});
            if(updatedLocation) result.result = updatedLocation;
        }
        catch(error) {
            console.log(error);
        }
        res.status(200).json(result);
    }
};

export default new LocationController;