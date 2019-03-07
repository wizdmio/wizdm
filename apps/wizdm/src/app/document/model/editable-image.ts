import { EditableContent } from './editable-content';
import { wmImage, wmTextStyle } from './editable-types';

export class EditableImage extends EditableContent<wmImage> {
  
  //get value(): string { return this.node.value || ''; }
  //set value(text: string) { this.node.value = text; }
  get pad(): string { return ''; }
  //get length() { return this.value.length; }
  //get empty(): boolean { return true; }
  /** Sets/gets the container's alignement */
  //set align(align: wmAlignType) { if(!!this.parent) { this.parent.align = align;} }
  //get align(): wmAlignType { return !!this.parent ? this.parent.align : 'left'; }
  /** Sets/gets the container's level */
  //set level(level: number) { if(!!this.parent) { this.parent.level = level;} }
  //get level(): number { return !!this.parent ? this.parent.level : 0; }
  /** Sets/gets the node style set */
  //set style(style: wmTextStyle[]) { }
  //get style(): wmTextStyle[] { return []; } 
  /*
  public set(text: string, style?: wmTextStyle[]): this { return this; }
  public append(text: string): string { return ''; }
  public tip(till: number): string { return ''; }
  public tail(from: number): string { return ''; }
  public insert(text: string, at?: number): string { return ''; }
  public extract(from: number, to?: number): string { return ''; }
  public cut(till: number, from?: number): string  { return ''; }
  public edges(index: number): [number, number] { return [0, 0]; }
  public format(style: wmTextStyle[]): this { return this; }
  public unformat(style: wmTextStyle[]): this { return this; }
  public merge(node: EditableImage): EditableImage { return this; }
  public split(from: number, to?: number): this { return this; }
  public break(): this { return this; }

  public link(url: string): this {
    this.data.url = !!url ? url : undefined;
    return this;
  }*/
}