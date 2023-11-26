import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'app-rich-inline-edit',
  templateUrl: './rich-inline-edit.component.html',
  styleUrls: ['./rich-inline-edit.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class RichInlineEditComponent implements OnChanges {

  // @Output() handleChange = new EventEmitter<string>();
  backupInput: string;
  @Output() handleSave = new EventEmitter<any>();
  @Input() inputData;
  //2021-11-1 vuonglqn add start
  @Input() readonlyRichInline = false;
  //2021-11-1 vuonglqn add end
  inputControl: FormControl;
  @Output() cacheInputChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() clickableIcon: false;
  isEditing: boolean;
  editorOptions = QuillConfiguration;
  constructor() {
    this.inputControl = new FormControl(this.inputData)
  }
  ngOnChanges(changes: SimpleChanges): void {
    //debugger;
    const issueChange = changes.inputData;
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.inputControl = new FormControl(this.inputData);
    }
  }
  setEditMode(mode: boolean) {
    this.isEditing = mode;
  }

  editorCreated(editor: any) {
    if (editor && editor.focus) {
      editor.focus();
      this.inputControl = new FormControl(this.inputData);
    }
  }
  inputChange(data) {
    if (this.cacheInputChange)
      this.cacheInputChange.emit({ data: this.inputControl.value, isRemove: false });
  }
  save() {
    // debugger;
    //handle data
    this.inputData = this.inputData;
    if (this.handleSave) {
      this.handleSave.emit(this.inputControl.value);
      this.cacheInputChange.emit({ data: this.inputControl.value, isRemove: true });
    }
    this.setEditMode(false);
  }

  cancel() {
    this.inputControl.patchValue(this.inputData);
    this.setEditMode(false);
    if (this.cacheInputChange)
      this.cacheInputChange.emit({ data: this.inputControl.value, isRemove: true });
  }
}

import Quill from 'quill';
const AlignStyle = Quill.import('attributors/style/align');
const BackgroundStyle = Quill.import('attributors/style/background');
const ColorStyle = Quill.import('attributors/style/color');
const DirectionStyle = Quill.import('attributors/style/direction');

const FontAttributor = Quill.import('attributors/style/font');
FontAttributor.whitelist = ['Arial', 'Raleway', 'Helvetica', 'Verdana', 'Times', 'Georgia', 'Courier', 'IRANSans', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'roboto',];

const FontSize = Quill.import('attributors/style/size');
FontSize.whitelist = ['10px', '12px', '14px', '16px', '22px', '36px', '48px', '72px', '144px']


Quill.register(FontAttributor, true);
Quill.register(FontSize, true);
Quill.register(BackgroundStyle, true);
Quill.register(ColorStyle, true);
Quill.register(AlignStyle, true);
Quill.register(DirectionStyle, true);


export const QuillConfiguration = {
  toolbar: [
    [{ font: ['Arial', 'Raleway', 'Helvetica', 'Verdana', 'Times', 'Georgia', 'Courier', 'IRANSans', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'roboto',] }], //Inline
    [{ size: ['10px', '12px', '14px', '16px', '22px', '36px', '48px', '72px', '144px'] }], //Inline
    [{ header: [1, 2, 3, 4, 5, 6, false] }], //Inline
    ['bold', 'italic', 'underline', 'strike'], //Inline
    [{ 'align': [] }], //Inline
    [{ 'direction': 'rtl' }], //Inline
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }], //Inline
    //[{ 'indent': '-1' }, { 'indent': '+1' }],
    //['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
}