import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { create, del, done } from "../store/modules/todo";
import { useEffect, useRef } from "react";
import { ReduxState, Todo } from "../types/types";
import axios from "axios";

export default function TodoList() {
  // useSelector()를 통해서 store의 state 가져오기
  let todoList = useSelector((state: ReduxState) => state.todo.list);

  // console.log(todoList);

  todoList = todoList.filter((todo: Todo) => todo.done === false);

  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  const nextID = useSelector((state: ReduxState) => state.todo.nextID);
  // console.log(nextID);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };
  // 할 일 추가 POST /todo
  const createTodo = async () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      // state를 변경해서 화면을 바꾸는 것
      dispatch(create({ id: nextID, text: inputRef.current?.value }));
    }

    // DB 정보를 바꾸기 위해서 axios 요청
    await axios.post(`${process.env.REACT_APP_API_SERVER}/todo`, {
      text: inputRef.current?.value,
    });
    clearInput();
  };

  // todo 상태 변경 PATCH /todo/:todoId
  const toDone = async (id: number) => {
    // state 를 변경해서 화면을 바꾸는것
    dispatch(done(id));

    // DB 정보를 바꾸기 위해 axios 요청
    await axios.patch(`${process.env.REACT_APP_API_SERVER}/todo/${id}`);
  };

  const enterTodo = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") createTodo();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // todo삭제 DELETE /todo/:todoId
  const deleteTodo = async (todoId: number) => {
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/todo/${todoId}`);

    dispatch(del(todoId));
  };
  return (
    <section>
      <h3>할 일 목록</h3>
      <div>
        <input type="text" ref={inputRef} onKeyDown={enterTodo} />
        <button onClick={createTodo}>추가</button>
      </div>
      <ul>
        {todoList.map((todo) => {
          return (
            <li key={todo.id}>
              <button onClick={() => toDone(todo.id)}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
