import { Show } from "solid-js";
import { A } from "@solidjs/router";

export default function Feeder(props) {
  const isDataAvailable = (data) => data && data.length > 0;

  return (
    <div class="card rounded-0 mb-2">
      <div class="card-header bg-dark text-light">Feeder {props.feeder}</div>
      <div class="card-body bg-dark">
        <Show when={isDataAvailable(props.lvswData)} fallback={<h5 class="text-center text-light">Loading</h5>}>
          <div class="card rounded-0 mb-2">
            <div class="card-header bg-dark text-light">Active Power</div>
            <div class="card-body bg-dark-subtle">
              <h6>{props.lvswData[0]?._value.toFixed(0)} kW</h6>
            </div>
          </div>
          <div class="card rounded-0 mb-2">
            <div class="card-header bg-dark text-light">Reactive Power</div>
            <div class="card-body bg-dark-subtle">
              <h6>{props.lvswData[4]?._value.toFixed(0)} kVAR</h6>
            </div>
          </div>
          <div class="card rounded-0 mb-2">
            <div class="card-header bg-dark text-light">Power Factor</div>
            <div class="card-body bg-dark-subtle">
              <h6>{props.lvswData[3]?._value.toFixed(0)}</h6>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
