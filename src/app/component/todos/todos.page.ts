import { Component, OnInit } from '@angular/core';
import { Todos } from '../../model/todos';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
})
export class TodosPage implements OnInit {
  /**
   * Todos to display
   */
  todoList: Todos[];
  constructor() {}

  ngOnInit() {
  }

  getTodos(event) {
    this.todoList = event;
  }
}
