import { Component, inject, NgModule, OnInit, signal } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { Todo } from '../../model/todo.type';
import { catchError } from 'rxjs';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { FilterToolsPipe } from '../../pipes/filter-tools.pipe';

@Component({
  selector: 'app-todos',
  imports: [TodoItemComponent, FormsModule, FilterToolsPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit{
  todoService = inject(TodosService);
  todoItems = signal<Array<Todo>>([]);
  searchTerm = signal('');

  ngOnInit(): void {
    this.todoService.getTodosFromApi()
    .pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      })
    )
    .subscribe((todos) => {
      this.todoItems.set(todos);
    });
  }

  updateTodo(todoItem : Todo){
    this.todoItems.update((todos) => {
      return todos.map(todo => {
        if(todo.id === todoItem.id) {
          return {
            ...todo,
            completed: !todo.completed,
          }
        }
        return todo;
      })
    })
  }
}