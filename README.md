# SPA-library

Single Page Application을 만들기 위한 여러 기술들을 바닐라 자바스크립트를 이용해 구현해보는 저장소입니다.

- [UI 컴포넌트](#UI-컴포넌트)
- [상태 관리 시스템](#상태-관리-시스템)

## UI 컴포넌트

- react를 모방하여 만들어졌습니다.
- [소스 코드](./Vanilla%20JS%EB%A1%9C%20SPA%20%EB%A7%8C%EB%93%A4%EA%B8%B0/src/core/Component.js)

### 기본 원리

- Component 클래스를 상속하여 컴포넌트를 제작할 수 있습니다.
- 선언적 프로그래밍으로 상태에 따른 UI를 갖는 컴포넌트를 제작할 수 있습니다.
- observer pattern을 이용하여 상태가 변화할 때마다 UI를 자동적으로 업데이트합니다.
- `afterMount`, `afterUpdate`등의 라이프사이클 메서드를 사용하여 추가적인 로직을 작성할 수 있습니다.

### 컴포넌트 작성하기

#### 엔트리 포인트 만들기

html문서를 따로 작성하지 않고, 대신 컴포넌트에 작성합니다. 그렇기 때문에 html문서는 앞으로 작성할 컴포넌트가 렌더링될 진입점만 있으면 됩니다.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="./src/main.mjs" defer></script>
    <title>SPA library example</title>
  </head>
  <body>
    <!-- 앞으로 작성할 모든 컴포넌트는 해당 div태그 안에 렌더링 될 것입니다. -->
    <div id="app"></div>
  </body>
</html>
```

이후, 앞으로 작성할 App(최상위) 컴포넌트를 생성하는 코드가 필요합니다.

```js
// main.js
import App from "./App.mjs";

// 컴포넌트 생성자는 기본적으로 DOM element를 target인자로 받습니다.
// html문서에 작성한 app id를 갖는 div태그를 target으로 전달하여 App 컴포넌트를 생성합니다.
new App(document.querySelector("#app"));
```

#### Component 상속하기

`Component` 클래스를 상속한 후, `template`, `setState`, `afterMount`등의 메서드를 오버라이딩하는 클래스를 작성하여 컴포넌트를 만들 수 있습니다.

```js
// App.js
import Component from "./core/Component.js";

export default class App extends Component {}
```

#### state, template, setState

- `setup()` 메서드에서 초기 상태를 정의할 수 있습니다.
- 컴포넌트는 상태에 따른 UI를 갖는데, 이는 `template()` 메서드에 작성합니다.
- `setState()` 메서드를 이용해 state를 변경할 수 있습니다.

```js
export default class App extends Component {
  setup() {
    this.state = {
      number: 1,
    };
  }

  template() {
    // 상태를 사용할 수 있습니다.
    const { number } = this.state;

    // template는 문자열을 반환해야합니다.
    // 해당 문자열은 innerHTML을 통해 DOM으로 변환됩니다.
    return `
    <span>${number}</span>
    `;
  }

  afterMount() {
    // setState를 이용하여 새로운 상태를 전달하면, 컴포넌트가 다시 렌더링됩니다.
    this.setState({ number: 7 });
  }
}
```

#### 불변성을 이용한 렌더링 최적화

`Object.is()` 메서드를 이용해 상태가 이전과 같은 값이라면, 리렌더링을 실행하지 않습니다.
그러므로, 주의해야할 점이 있습니다.

```js
const { arr } = this.state;
arr.push(1);

// arr의 주소가 바뀌지 않았습니다. 그러므로 Object.is()에서 true가 나와, 리렌더링을 실행하지 않습니다.
// 리렌더링을 위해선 배열이나 객체를 새롭게 생성하여 전달해야합니다.
this.setState({ arr });
```

#### 이벤트 등록

`setEvent()` 메서드와 `addEventListener(eventType, selector, callback)` 메서드를 이용합니다.

```js
export default class ItemFilter extends Component {
  template() {
    // 생략
  }

  setEvents() {
    // addEventListener는 이벤트 타입, 선택자(css의 그것), 콜백 함수를 받습니다.
    // 해당 방법으로 이벤트 리스너를 등록하면, 컴포넌트가 제거될 때 이벤트 리스너도 자동적으로 제거됩니다.
    this.addEventListener("click", "button", (e) => {
      if (e.target.classList.contains("filterBtn")) store.dispatch(setFilter(true));
      if (e.target.classList.contains("viewAllBtn")) store.dispatch(setFilter(false));
    });
  }
}

// addEventListener의 내부 구조
addEventListener(eventType, selector, callback) {
  const listener = (e) => {
    // 이벤트 타겟이 선택자에 선택될 때만 callback을 실행합니다.
    // closest를 이용해 타겟의 내부에서 발생한 이벤트(버튼안의 img가 클릭된다거나) 에도 callback을 실행할 수 있도록 합니다.
    if (e.target.closest(selector)) callback(e);
  };

  // target에 이벤트 리스너를 추가합니다. (이벤트 위임 방식)
  this.target.addEventListener(eventType, listener);

  // 컴포넌트가 제거될 때, this.attatchedEventListeners에 있는 이벤트 리스너들도 제거됩니다.
  this.attacthedEventListeners.push({ eventType, listener });
}
```

#### 라이프사이클

- `afterMount()` - 컴포넌트가 마운트(생성)된 후 호출됩니다.
- `beforeUpdate()` - 컴포넌트가 업데이트되기 전 호출됩니다.
- `afterUpdate()` - 컴포넌트가 업데이트된 후 호출됩니다.
- `beforeUnmount()` - 컴포넌트가 언마운트(제거)되기 전 호출됩니다.

위의 라이프사이클 메서드를 오버라이딩하여 사용합니다.

```js
export default class ItemFilter extends Component {
  template() {
    // 생략
  }

  afterMount() {
    // 컴포넌트가 마운트된 후 뭔가 추가적인 동작을 할 수 있습니다.
    // 비동기 요청으로 추가 데이터를 요청하는 등...
  }

  beforeUnmount() {
    // 네트워크 요청, setInterval등을 해제하는데 유용하게 사용될 수 있습니다.
  }
}
```

#### 자식 컴포넌트 생성하기

- `data-component`를 갖고있는 태그를 작성합니다.
- 이후, `generateChildComponent(target, name, key)`에서 자식 컴포넌트를 생성해 반환하는 코드를 작성해야합니다.

```js
// 이 저장소의 실제 예제입니다.
import Component from "./core/Component.js";
import ItemAppender from "./components/ItemAppender.js";
import Items from "./components/Items.js";
import ItemFilter from "./components/ItemFilter.js";
import InputA from "./components/InputA.js";
import InputB from "./components/InputB.js";
import APlusB from "./components/APlusB.js";

export default class App extends Component {
  template() {
    // data-component를 갖고있는 element내부에 자식 컴포넌트를 생성합니다.
    // 만약 같은 컴포넌트를 여러개 렌더링해야한다면, 유일한 값을 갖는 data-key를 추가적으로 작성합니다.
    return `
    <div class="itemAppender" data-component="ItemAppender"></div>
    <div class="items" data-component="Items"></div>
    <div class="itemFilter" data-component="ItemFilter"></div>
    <div data-component="InputA"></div>
    <div data-component="InputB"></div>
    <div data-component="APlusB"></div>
    `;
  }

  // data-component를 갖고있는 element를 만날 때 마다 아래 메서드를 실행하여 자식 컴포넌트를 생성합니다.
  // target은 data-component를 갖고있는 element입니다.
  // name은 data-component의 값입니다.
  // key는 같은 이름의 컴포넌트를 구별하기 위해 추가적으로 작성되는 것이며, data-key의 값입니다.
  generateChildComponent(target, name, key) {
    // 내부 형식은 if else, switch 뭐든 상관없습니다.
    // target을 전달해 생성한 새로운 컴포넌트를 반환하기만 하면 됩니다.
    if (name === "ItemAppender") {
      return new ItemAppender(target);
    }
    if (name === "Items") {
      return new Items(target);
    }
    if (name === "ItemFilter") {
      return new ItemFilter(target);
    }
    if (name === "InputA") {
      return new InputA(target);
    }
    if (name === "InputB") {
      return new InputB(target);
    }
    if (name === "APlusB") {
      return new APlusB(target);
    }
  }
}
```

### 참고 자료

- [Vanilla Javascript로 웹 컴포넌트 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/#_1-%E1%84%8F%E1%85%A5%E1%86%B7%E1%84%91%E1%85%A9%E1%84%82%E1%85%A5%E1%86%AB%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AA-%E1%84%89%E1%85%A1%E1%86%BC%E1%84%90%E1%85%A2%E1%84%80%E1%85%AA%E1%86%AB%E1%84%85%E1%85%B5)
- [Vanilla Javascript로 가상돔(VirtualDOM) 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/)
- [리액트 공식 문서](https://ko.reactjs.org/tutorial/tutorial.html)
- [리액트 라이프사이클의 이해](https://kyun2da.dev/react/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4%EC%9D%98-%EC%9D%B4%ED%95%B4/)
- [번역 - 리액트에 대해서 그 누구도 제대로 설명하기 어려운 것 – 왜 Virtual DOM 인가?](https://velopert.com/3236)
- [번역 - 리액트는 언제 컴포넌트를 렌더링 하나요?](https://velog.io/@eunbinn/when-does-react-render-your-component)
- [나만의 리액트 라이브러리 만들기](https://velog.io/@godori/build-your-own-react)

## 상태 관리 시스템

- redux를 모방하여 만들어졌습니다.
- [소스 코드](./Vanilla%20JS%EB%A1%9C%20SPA%20%EB%A7%8C%EB%93%A4%EA%B8%B0/src/core/createStore.js)

### 기본 원리

- flux 패턴을 이용한 저장소입니다.
- action을 dispatch하여 저장소의 상태를 바꾸고, `getState()`를 이용해 저장소의 읽기 전용 상태를 받을 수 있습니다.
- 컴포넌트의 렌더링 과정에 `getState()`를 이용해 특정 상태를 참조했다면, 해당 상태가 바뀔때 컴포넌트가 update됩니다.
- `combineReducers()`를 사용해 reducer들을 합성할 수 있습니다.
- store를 생성할 때 persistConfig를 제공하여 reducer의 상태를 localStorage에 저장하고 불러올 수 있습니다.

### 리듀서 작성하기

- reducer는 state와 action을 받아, 새로운 state를 반환하는 함수입니다.

#### action type

- action의 타입을 미리 정의하여 사용합니다.

```js
export const ITEM_ACTION_TYPES = {
  SET_FILTER: "item/SET_IS_FILTERED",
  SET_ITEMS: "item/SET_ITEMS",
};
```

#### action creator

- action을 생성해주는 함수를 만듭니다.
- 해당 함수는 외부에서 store에 dispatch를 할 때 사용합니다.

```js
export function setFilter(boolean) {
  // createAction은 type과 payload를 갖는 object의 형태(action)을 생성해주는 유틸 함수입니다.
  return createAction(ITEM_ACTION_TYPES.SET_FILTER, boolean);
}

export function createAction(type, payload) {
  return {
    type,
    payload,
  };
}
```

#### reducer

- reducer는 state와 action을 받아, 새로운 state를 반환하는 함수입니다.
- 그렇게 생성된 state는 store에 저장되어 외부에서 사용할 수 있게 됩니다.

```js
// 초기 상태를 정의합니다.
const ITEM_INITIAL_STATE = {
  filter: false,
  items: [
    {
      id: 0,
      content: "some item!",
      isFiltered: false,
    },
  ],
};

export function itemReducer(state = ITEM_INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  // action의 type에 따라 다른 상태를 리턴합니다.
  switch (type) {
    case ITEM_ACTION_TYPES.SET_FILTER:
      return {
        ...state,
        filter: payload,
      };
    case ITEM_ACTION_TYPES.SET_ITEMS:
      return {
        ...state,
        items: payload,
      };
    default:
      return state;
  }
}
```

### store 만들기

- 작성한 reducer를 이용해 store를 생성할 수 있습니다.
- [소스 코드](./Vanilla%20JS%EB%A1%9C%20SPA%20%EB%A7%8C%EB%93%A4%EA%B8%B0/src/core/createStore.js)

```js
export const store = createStore(itemReducer);
```

- 이렇게 생성된 store의 상태를 외부에서 접근할 수 있고, action을 dispatch해서 상태를 변경할 수 있습니다.

```js
import Component from "../core/Component.js";

import { store } from "../store/store.js";
import { toggleItemFilter } from "../store/item/item.action.js";

export default class Items extends Component {
  template() {
    // 컴포넌트에서 store의 상태에 접근하면, 추후에 store의 상태가 바뀔 때 update 됩니다.
    const { items } = store.getState();

    // 생략
  }

  setEvents() {
    this.addEventListener("click", "button", (e) => {
      const { isFiltered } = store.getState();

      // store에 action을 dispatch해서 내부 상태를 바꿀 수 있습니다.
      store.dispatch(toggleItemFilter(!isFiltered));
    });
  }
}
```

#### combineReducers를 이용해 여러 reducer를 사용하기

- [소스 코드](./Vanilla%20JS%EB%A1%9C%20SPA%20%EB%A7%8C%EB%93%A4%EA%B8%B0/src/core/combineReducers.js)

```js
import { combineReducers } from "../core/combineReducers.js";

import { abReducer } from "./ab/ab.reducer.js";
import { itemReducer } from "./item/item.reducer.js";

// combineReducers 함수를 사용해 여러 리듀서를 하나의 리듀서로 만들 수 있습니다.
export const rootReducer = combineReducers({
  ab: abReducer,
  item: itemReducer,
});

// 이렇게 생성된 리듀서는, action이 dispatch되었을 때 전달받은 리듀서들을 전부 업데이트 한 후
// 반환된 상태들을 취합한 새로운 상태를 만들어 반환하는 함수가 됩니다.
```

#### localStorage에 store의 상태 저장하고 불러오기

- [소스 코드](./Vanilla%20JS%EB%A1%9C%20SPA%20%EB%A7%8C%EB%93%A4%EA%B8%B0/src/core/createStore.js)

```js
// persistConfig를 createStore에 추가적으로 전달하여 특정 reducer의 상태를 저장하고 불러올 수 있습니다.
const persistConfig = {
  key: "root",
  whitelist: ["item", "ab"],
};

export const store = createStore(rootReducer, persistConfig);
```

### 참고 자료

- [Vanilla Javascript로 상태관리 시스템 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Store/)
- [redux 공식 문서](https://ko.redux.js.org/introduction/getting-started/)
