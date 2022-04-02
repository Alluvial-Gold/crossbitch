import { Pipe, PipeTransform } from '@angular/core';
import { ICONS } from 'src/app/shared/constants/icons.constants';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(value: number): unknown {
    return ICONS[value].path
  }

}
