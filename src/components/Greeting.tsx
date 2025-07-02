type Props = {
  name: string;
  children?: React.ReactNode;
};

function Greeting(props: Props) {
  return (
    <>
      <h1>Welcome to my app! {props.name} </h1>
      <div> {props.children}</div>
    </>
  );
}

export default Greeting;
