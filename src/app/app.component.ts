import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';

interface Note{
  id: number;
  title: string;
  description: string;
  date: Date;
  tags: Array<string>;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'softca-keep';

  notes:  Array<Note> = [];

  noteSelected: Note;
  noteId: number = -1;
  tags: Set<string> = new Set();

  listItemSelected: any;

  indexColor: number = 0;

  colors = ['carrato1', 'carrato2', 'carrato3', 'carrato4', 'carrato5'];

  filterFormControl = new FormControl('', []);

  filterNotes: Array<Note> = [];

  constructor(public dialog: MatDialog) {
    
    this.noteSelected = {id: 0, title: '', description: '', date: new Date(), tags: [], color: this.colors[0]};

    this.notes.push({id: 123, title: 'Example note', description: 'This is a note with a #tag', date: new Date(), tags: ['#tag'], color: this.colors[0]});

    this.setTags();

    this.filterNotes = this.notes;

  }

  newNote(){

    this.noteSelected = {id: 0, title: '', description: '', date: new Date(), tags: [], color: this.colors[0]};

    this.openDialog();

  }

  editNote(note: Note){
    this.noteSelected = note;
    this.noteId = note.id;
    this.openDialog();
  }

  removeNote(note: Note){

    const index = this.notes.indexOf(note);

    this.notes.splice(index, 1); 

    this.setTags();

  }

  onSelection(options: MatListOption[]) {

    if(!options[0]){
      return;
    }

    this.filterNotes = this.notes.filter( e => e.description.includes(options[0].value));
    
  }

  setTags(){

    this.tags = new Set();

    for(let i = 0; i < this.notes.length; i++ ){

      let iterator = this.notes[i].tags!.values();
        
      for (let element of iterator) {
        this.tags.add(element);
      }
    }

    return this.tags.values();

  }

  changeColor(note: Note){
    
    const color = (note.color) ? note.color: this.colors[0];

    let index = this.colors.indexOf(color);

    if(index == this.colors.length - 1){
      index = 0;
    }else{
      index += 1;
    }

    note.color = this.colors[index];

    
  }

  findNotes(){
    this.filterNotes = this.notes.filter( e => e.description.includes(this.filterFormControl.value));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNoteDialog, {
      width: '450px',
      data: {note: this.noteSelected}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.data.note.id == 0){

          const tags = result.data.note.description.match(/#[\w]+/ig);

          result.data.note.tags = tags;
          result.data.note.color = this.colors[0];

          const date = new Date();

          result.data.note.date = date;
          result.data.note.id = date.getTime();

          this.notes.push(result.data.note);

        }else{
          this.notes = this.notes.map( (e) => {
            if(e.id == this.noteId){

              const tags = result.data.note.description.match(/#[\w]+/ig);
              
              e = result.data.note;

              e.color = this.colors[0];

              e.tags = tags;

            }
            return e;
          })
        }
        this.setTags();
        this.findNotes();
      }
    });
  }

}

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