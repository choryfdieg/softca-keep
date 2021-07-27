import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Note } from '../../shared/interfaces/note.interface';

@Component({
    selector: 'dialog-note',
    templateUrl: 'dialog-note.html',
  })
  export class DialogNoteDialog {
    
    noteForm: FormGroup;
    note: Note;
  
    constructor(
      public dialogRef: MatDialogRef<DialogNoteDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, fb: FormBuilder) {
  
      this.note = {id: data.note.id, title: data.note.title, description: data.note.description, date: data.note.date, tags: data.note.tags, color: data.note.color};
  
      console.log('dialog ', this.note);
  
      this.noteForm = fb.group({
        title: new FormControl(data.note.title),
        description: new FormControl(data.note.description),
      });
      
  
    }
  
    get title(){
      return (this.noteForm.get('title')?.value) ? this.noteForm.get('title')?.value : 'New Task';
    }
  
    onNoClick(): void {
      this.dialogRef.close({ data: {note: null, new: null} });
    }
  
    saveNote(){    
      if(!this.noteForm.invalid){
        this.note= {id: this.data.note.id, title : this.noteForm.get('title')?.value, description: this.noteForm.get('description')?.value, date: new Date(), tags: this.data.note.tags, color: this.data.note.color};
        this.dialogRef.close({ data: {note: this.note} });
      }
    }
  
  }