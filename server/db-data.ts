
import { Conversation } from './model/conversation';

export const INITIAL_MOCK_USER_EMAIL = 'golab.fayazi86@gmail.com';
export const INITIAL_MOCK_USER_PASSWORD = '12345678';

export const conversations: Conversation[] = [
  {
    id: 'conv-create-component',
    userId: 'user-1',
    title: 'How to create component in angular',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'How do I create a new component in Angular?',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'You can scaffold a component with the Angular CLI by running `ng generate component my-feature` ' +
          '(or the shorthand `ng g c my-feature`). This creates a folder with the component class, an external ' +
          'template, a stylesheet and a unit test, and it wires the component into the nearest routing or ' +
          'declaration context automatically.',
      },
      {
        id: 'm3',
        role: 'user',
        content: 'Do I still need to declare it in an NgModule?',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'No. Modern Angular components are standalone by default, so there is no NgModule declaration step. ' +
          'You simply add the component to the `imports` array of whatever standalone component or route needs it.',
      },
    ],
  },
  {
    id: 'conv-routing',
    userId: 'user-1',
    title: 'Angular routing how it works',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Can you explain how the Angular Router works at a high level?',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'The Router maps URL paths to components through a `Routes` configuration. When the URL changes, the ' +
          'Router matches the path, resolves any guards and data, and renders the matched component into a ' +
          '`<router-outlet>`. Nested outlets let you compose layouts from parent and child routes.',
      },
      {
        id: 'm3',
        role: 'user',
        content: 'How do I lazy load a feature area?',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'Use `loadComponent` for a single standalone component or `loadChildren` for a group of routes. Both ' +
          'accept a function returning a dynamic `import()`, so the feature code is only downloaded when the user ' +
          'first navigates to that path.',
      },
    ],
  },
  {
    id: 'conv-services',
    userId: 'user-1',
    title: 'What is service in angular',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is a service in Angular and when should I use one?',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'A service is a plain class dedicated to a single responsibility such as data access, logging or state ' +
          'management. Marking it with `@Injectable({ providedIn: "root" })` makes it a singleton that any ' +
          'component can request through the `inject()` function, keeping components focused on presentation.',
      },
      {
        id: 'm3',
        role: 'user',
        content: 'How is that different from putting the logic directly in the component?',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'Moving logic into a service makes it reusable across components, easier to unit test in isolation, and ' +
          'simpler to mock. It also keeps your components small, which is one of the core Angular best practices.',
      },
    ],
  },
  {
    id: 'conv-signals',
    userId: 'user-1',
    title: 'Understanding Angular signals',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What problem do signals solve compared to plain properties?',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Signals give Angular a precise dependency graph of your state. Reading a signal inside a template or a ' +
          '`computed()` registers a subscription, so when the value changes Angular updates only the views that ' +
          'actually depend on it instead of checking the whole component tree.',
      },
      {
        id: 'm3',
        role: 'user',
        content: 'When would I reach for computed() versus effect()?',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'Use `computed()` to derive a new value from other signals in a pure way. Use `effect()` only for side ' +
          'effects such as logging, synchronising with `localStorage`, or integrating with non-signal libraries.',
      },
    ],
  },
];
