import { observer } from "mobx-react";
import store from "src/store/store";

const Time = observer(() => {
  let { time, testName } = store;

  return (
    <div className="time">
      <div>{testName}</div>
      Прошло времени { time.hours }:{ time.minutes }:{ time.seconds }
    </div>
  )
});

export default Time;