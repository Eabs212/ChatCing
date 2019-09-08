import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TimeLinePage } from './time-line.page';
import { ComponentModule } from '../../components/components.module';
const routes: Routes = [
  {
    path: '',
    component: TimeLinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TimeLinePage]
})
export class TimeLinePageModule {}
