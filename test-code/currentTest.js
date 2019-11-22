class BasicJSX extends React.Component {
  someMethod() {
    return (
      <div>
        <SomeComponentInMethod>
          <ChildComponent />
        </SomeComponentInMethod>
      </div>
    );
  }
  someMethodWithCallExpression() {
    return (
      <div>
        <SomeComponentInMethod>
          {this.someMethod()}
          {someFunction()}
        </SomeComponentInMethod>
      </div>
    );
  }
  render() {
    return (
      <div>
        <SomeComponent />
        <ParentComponent>
          <ChildComponent prop={function inLinePropFunction() {}} />
        </ParentComponent>
      </div>
    );
  }
}
