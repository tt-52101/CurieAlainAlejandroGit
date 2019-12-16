import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-crono',
  templateUrl: './crono.component.html',
  styleUrls: ['./crono.component.less']
})
export class CronoComponent implements OnInit {

  @Input() initTime: string;
  isStarted = false;
  buttonTimer = {
    hours: null,
    minutes: null,
    seconds: null,
  }
  cronoStatus: string;
  timer: any = null;
  constructor() { }

  ngOnInit() {
    this.buttonTimerFunction(this.initTime || '00:00:00');
  }

  /**
   * Animacion para el boton de imputacion rapida
   */
  private buttonTimerFunction(time: string = '00:00:00') {
    if (!/\d{2}:\d{2}:\d{2}/.test(time)) {
      throw new Error('El formato de tiempo ha formatearse como 00:00:00');
    }
    this.cronoStatus = time;
    this.timer = setInterval(() => {
      if (this.cronoStatus) {
        const Time: number[] = this.cronoStatus.split(':').map((e: string) => +e);
        Time[2] = ++Time[2] === 60 ? 0 : Time[2]++;
        Time[1] = Time[2] === 0 ? ++Time[1] : Time[1];
        Time[1] = Time[1] === 60 ? 0 : Time[1];
        Time[0] = Time[1] === 0 && Time[2] === 0 ? ++Time[0] : Time[0];
        this.cronoStatus = Time.map((e: number) => e.toString().padStart(2, '0')).join(':');
      }
    }, 1000);
  }
}
