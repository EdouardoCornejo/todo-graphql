import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatusArgs } from 'src/todo/dto/args/status.args';
import { CreateTodoInput } from 'src/todo/dto/inputs/create-todo.input';
import { UpdateTodoInput } from 'src/todo/dto/inputs/update-todo.input';
import { Todo } from 'src/todo/entity/todo.entity';
import { TodoService } from 'src/todo/todo.service';
import { AggregationsType } from 'src/todo/types/aggregations.type';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], {
    name: 'todos',
    description: 'Get all todos',
  })
  findAll(@Args() statusArgs: StatusArgs): Todo[] {
    return this.todoService.findAll(statusArgs);
  }

  @Query(() => Todo, {
    name: 'todo',
    description: 'Get a todo by ID',
  })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.findOne(id);
  }

  @Query(() => Int, { name: 'totalTodos' })
  totalTodos(): number {
    return this.todoService.totalTodos();
  }

  @Query(() => Int, { name: 'completedTodos' })
  completedTodos(): number {
    return this.todoService.completedTodos();
  }
  @Query(() => Int, { name: 'pendingTodos' })
  pendingTodos(): number {
    return this.todoService.pendingTodos();
  }

  @Query(() => AggregationsType)
  aggregations(): AggregationsType {
    return {
      completed: this.todoService.completedTodos(),
      pendding: this.todoService.pendingTodos(),
      total: this.todoService.totalTodos(),
      totalTodosCompleted: this.todoService.completedTodos(),
    };
  }

  @Mutation(() => Todo, {
    name: 'createTodo',
    description: 'Create a new todo',
  })
  createTodo(@Args('CreateTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.createTodo(createTodoInput);
  }

  @Mutation(() => Todo, {
    name: 'updateTodo',
    description: 'Update a todo',
  })
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    const todo = this.todoService.updateTodo(updateTodoInput);
    return todo;
  }

  @Mutation(() => Boolean)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.delete(id);
  }
}
