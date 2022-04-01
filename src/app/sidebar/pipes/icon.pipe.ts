import { Pipe, PipeTransform } from '@angular/core';
import { Icons } from 'src/app/shared/icons.constants';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(value: number): unknown {
    return Icons[value].path
  }

}
