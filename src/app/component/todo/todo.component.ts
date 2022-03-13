import { Component, Input, OnInit } from '@angular/core';
import { Todos } from '../../model/todos';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {

  @Input() todo: Todos;
  constructor() { }

  ngOnInit() {}

}
