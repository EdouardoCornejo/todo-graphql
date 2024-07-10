import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusArgs } from 'src/todo/dto/args/status.args';
import { CreateTodoInput } from 'src/todo/dto/inputs/create-todo.input';
import { UpdateTodoInput } from 'src/todo/dto/inputs/update-todo.input';
import { Todo } from 'src/todo/entity/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Learn NestJS', done: false },
    { id: 2, description: 'Learn GraphQL', done: false },
    { id: 3, description: 'Learn TypeScript', done: false },
    { id: 4, description: 'Learn JavaScript', done: true },
    { id: 5, description: 'Learn React', done: true },
  ];

  findAll(statusArgs: StatusArgs): Todo[] {
    if (statusArgs.status !== undefined)
      return this.todos.filter((todo) => todo.done === statusArgs.status);
    return this.todos;
  }
  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  createTodo(createTodoInput: CreateTodoInput) {
    const todo = new Todo();
    todo.description = createTodoInput.description;
    todo.id = Math.max(...this.todos.map((todo: Todo) => todo.id), 0) + 1;

    this.todos.push(todo);

    return todo;
  }

  updateTodo({ id, description, done }: UpdateTodoInput) {
    const todoToUpdate = this.findOne(id);

    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo: Todo) => {
      if (todo.id === id) {
        return todoToUpdate;
      }
      return todo;
    });

    return todoToUpdate;
  }

  delete(id: number) {
    this.findOne(id);

    this.todos = this.todos.filter((todo) => todo.id !== id);

    return true;
  }

  totalTodos() {
    return this.todos.length;
  }

  completedTodos() {
    return this.todos.filter((todo) => todo.done === true).length;
  }

  pendingTodos() {
    return this.todos.filter((todo) => todo.done === false).length;
  }
}
