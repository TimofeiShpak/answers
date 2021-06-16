import { observer } from "mobx-react";
import store from "src/store/store";

const Time = observer(() => {
  let time = store.time;

  return (
    <div className="time">
      Прошло времени { time.hours }:{ time.minutes }:{ time.seconds }
    </div>
  )
});

export default Time;