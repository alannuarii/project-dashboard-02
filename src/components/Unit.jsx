import { Show } from "solid-js";
import { A } from "@solidjs/router";
import "./Unit.css";

export default function Unit(props) {
  const isDataAvailable = (data) => data && data.length > 0;

  return (
    <div class="card bg-dark rounded-0 border-2 border-light p-2">
      <div class="mb-2">
        <A href={`/pltd/${props.unit}`} class="unit text-light d-block">
          Unit {props.unit}
        </A>
        <Show
          when={props.dgData[0]._value !== 0 && props.dgData[0]._value !== "N/A"}
          fallback={props.dgData[0]._value === 0 ? <span class="badge rounded-0 text-bg-warning">Standby</span> : <span class="badge rounded-0 text-bg-secondary">Not Available</span>}
        >
          <span class="badge rounded-0 text-bg-success">Operating</span>
        </Show>
      </div>
      <Show when={isDataAvailable(props.dgData)} fallback={<h5 class="text-center">Loading</h5>}>
        <div class="card rounded-0 mb-2">
          <div class="card-header bg-dark text-light">Active Power</div>
          <div class="card-body bg-dark-subtle">
            <h6>{props.dgData[0]._value > 0 ? props.dgData[0]._value.toFixed(0) : 0} kW</h6>
          </div>
        </div>
        <div class="card rounded-0 mb-2 d-none d-md-block">
          <div class="card-header bg-dark text-light">Reactive Power</div>
          <div class="card-body bg-dark-subtle">
            <h6>{props.dgData[6]._value > 0 ? props.dgData[6]._value.toFixed(0) : 0} kVAR</h6>
          </div>
        </div>
        <div class="card rounded-0 d-none d-md-block">
          <div class="card-header bg-dark text-light">Power Factor</div>
          <div class="card-body bg-dark-subtle">
            <h6>{props.dgData[5]._value > 0 ? props.dgData[5]._value.toFixed(2) : 0}</h6>
          </div>
        </div>
      </Show>
    </div>
  );
}
