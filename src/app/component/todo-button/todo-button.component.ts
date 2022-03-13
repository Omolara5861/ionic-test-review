import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BtnState } from '../../model/btn-state';
import { Todos } from '../../model/todos';
import { TodosService } from '../../services/todos.service';


@Component({
  selector: 'app-todo-button',
  templateUrl: './todo-button.component.html',
  styleUrls: ['./todo-button.component.scss'],
})
export class TodoButtonComponent implements OnInit {
  /**
   * EventEmitter for when there is a change in status
   */
  @Output() statusChange = new EventEmitter<BtnState>();
  /**
   * EventEmitter for when todos are fetched and need to be pushed to the
   * todos display component
   */
  @Output() todosChange = new EventEmitter<Todos[]>();

  countDown: number;
  /**
   * Current state of Button
   */
  btnStatus: BtnState;

  constructor(
    private todosService: TodosService,
  ) {  }

  /**
   * Setter function to set the current button state and perform the necessary action
   *
   * @param val
   */
  set status(val) {
    this.btnStatus = val;
    this.statusChange.emit(this.btnStatus);
    switch (this.btnStatus) {
      case BtnState.loading:
        this.loadTodos();
        break;

      case BtnState.loadedAndDelaying:
        this.countDownMethod();
        break;
    }
  }

  ngOnInit() {
    this.status = BtnState.loading;
  }

  /**
   * Counts down till the provided duration
   *
   * @param duration
   */
  countDownMethod(duration: number = 11) {
    interval(1000)
    .pipe(
      take(duration),
      map(count => duration - count - 1)
      )
      .subscribe(seconds => {
        this.countDown = seconds;
        if(seconds === 0) {
          this.status = BtnState.loaded;
        }
    });
  }

  /**
   * On click handler for TodoButton
   */
  onStateChange() {
    this.status = BtnState.loading;
  }

  /**
   * Fetches the todolist from API and emits it
   * for it to be displayed by the parent TodosComponent
   */
  loadTodos() {
    this.todosService.getTodos()
      .subscribe((res: Todos[]) => {
        this.todosChange.emit(res);
        this.status = BtnState.loadedAndDelaying;
      },
        (error) => {
        this.todosChange.emit([]);
        this.status = BtnState.error;
      });
  }
}
