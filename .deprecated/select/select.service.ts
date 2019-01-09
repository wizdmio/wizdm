import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectService {

  constructor(private from: number, private to: number) { }

  public get isCollapsed(): boolean {
    return this.from === this.to;
  }

  public get span(): number {
    return this.from - this.to;
  }

  public collapse() {
    this.from = this.to;
  }

  public get(): [number, number] {
    return [this.from, this.to];
  }

  public set(from: number, to: number) {
 
    // Don't allow values less then 0
    from = Math.max(0, from);
    to = Math.max(0, to);

    // Ensure the values are set in the correct order from (smallest) to (largest)
    this.from = Math.min(from, to);
    this.to = Math.max(from, to);
  }
}


