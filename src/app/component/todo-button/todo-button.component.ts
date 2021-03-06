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

  /**
   *Created a state property of the Button so that it can be referenced in html
   */
  btnState = BtnState;

  /**
   * Btn Text property to change the text of the button depending on the state
   */
  btnText: string;

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
      case this.btnState.loading:
        this.loadTodos();
        this.btnText = 'loading';
        break;

      case this.btnState.loadedAndDelaying:
        this.countDownMethod();
        this.btnText = 'wait';
        break;
      case this.btnState.loaded:
      this.btnText = 'reload';
      break;
      case this.btnState.error:
      this.btnText = 'Load Error.Retry';
    }
  }

  ngOnInit() {
    this.status = this.btnState.loading;
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
          this.status = this.btnState.loaded;
        }
    });
  }

  /**
   * On click handler for TodoButton
   */
  onStateChange() {
    this.status = this.btnState.loading;
  }

  /**
   * Fetches the todolist from API and emits it
   * for it to be displayed by the parent TodosComponent
   */
  loadTodos() {
    this.todosService.getTodos()
      .subscribe((res: Todos[]) => {
        this.todosChange.emit(res);
        this.status = this.btnState.loadedAndDelaying;
      },
        (error) => {
        this.todosChange.emit([]);
        this.status = this.btnState.error;
      });
  }
}
