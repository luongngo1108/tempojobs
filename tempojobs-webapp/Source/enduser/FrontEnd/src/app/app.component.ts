import { Component, OnInit } from '@angular/core';
import { ReactiveFormConfig } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EndUser';
  ngOnInit(): void {
    ReactiveFormConfig.set({
      internationalization: {
        dateFormat: 'dmy',
        seperator: '/'
      },
      validationMessage: {
        alpha: 'Chỉ chấp nhận chữ cái.',
        alphaNumeric: 'Chỉ chấp nhận chữ cái và số.',
        compare: 'Dữ liệu không khớp.',
        contains: 'Giá trị không chứa trong đầu vào.',
        creditcard: 'Số thẻ tín dụng không đúng.',
        digit: 'Chỉ chấp nhận số.',
        email: 'Email không hợp lệ.',
        greaterThanEqualTo: 'Vui lòng nhập giá trị lớn hơn hoặc bằng tuổi tham gia.',
        greaterThan: 'Vui lòng nhập giá trị lớn hơn tuổi tham gia.',
        hexColor: 'Vui lòng nhập mã hex.',
        json: 'Vui lòng nhập JSON hợp lệ.',
        lessThanEqualTo: 'Vui lòng nhập giá trị nhỏ hơn hoặc bằng kinh nghiệm hiện tại.',
        lessThan: 'Vui lòng nhập giá trị nhỏ hơn hoặc bằng kinh nghiệm hiện tại.',
        lowerCase: 'Chỉ chấp nhận chữ thường.',
        maxLength: 'Độ dài tối đa là {{1}} ký tự.',
        maxNumber: 'Nhập giá trị nhỏ hơn hoặc bằng {{1}}.',
        minNumber: 'Nhập giá trị lớn hơn hoặc bằng {{1}}.',
        password: 'Vui lòng nhập mật khẩu hợp lệ.',
        pattern: 'Vui lòng nhập mã zip hợp lệ.',
        range: 'Vui lòng nhập giá trị trong khoảng {{1}} đến {{2}}.',
        required: 'Trường này là bắt buộc.',
        time: 'Chỉ chấp nhận định dạng thời gian.',
        upperCase: 'Chỉ chấp nhận chữ in hoa.',
        url: 'Chỉ chấp nhận định dạng URL.',
        zipCode: 'Nhập mã zip hợp lệ.',
        minLength: 'Độ dài tối thiểu là {{1}} ký tự.',
        numeric: 'Chỉ chấp nhận số.',
      }
    });
  }
}
