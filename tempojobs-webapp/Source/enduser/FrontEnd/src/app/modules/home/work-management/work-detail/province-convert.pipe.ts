import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'provinceConvert'
})
export class ProvinceConvertPipe implements PipeTransform {

  transform(province: string, district: string, listProvince: any[]): string {
    var result = "";
    if(listProvince && listProvince.length > 0 && province && district) {
      var provinceName = listProvince?.find(x => x.codename === province)?.name;
      var listDistrict: any[] = [];
      listProvince.map((x, index) => {
        if (x.codename === province) {
          listDistrict = listProvince[index].districts;
        }
      })
      var districName = listDistrict?.find(x => x.codename === district)?.name;
      console.log(provinceName, districName)
      if(provinceName && districName) result = `, ${provinceName}, ${districName}`;
    }
    return result;
  }

}
