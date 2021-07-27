import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { DialogNoteDialog } from '../dialog-note/dialog-note.component';
import { Note } from '../../shared/interfaces/note.interface';

@Component({
  selector: 'note-component',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})

export class NoteComponent {

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

    this.filterNotes = this.notes;

    this.setTags();

  }

  onSelection(options: MatListOption[]) {

    if(!options[0]){
      return;
    }

    if(!options[0].value){
      this.filterNotes = this.notes;  
    }else{
      this.filterNotes = this.notes.filter( e => e.description.includes(options[0].value));
    }

    
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