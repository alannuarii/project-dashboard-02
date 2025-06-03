import { Show } from "solid-js";
import { A } from "@solidjs/router";

export default function Battery(props) {
  const isDataAvailable = (data) => data && data.length > 0;

  return (
    <div class="card rounded-0 mb-2">
      <div class="card-header bg-dark text-light">Battery Storage System</div>
      <div class="card-body bg-dark">
        <Show when={isDataAvailable(props.itData[0])} fallback={<h5 class="text-center text-light">Loading</h5>}>
          <div class="row gx-2 ">
            <div class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Feeder 1</div>
                <div class="card-body bg-dark-subtle">
                  <h6>{props.itData[0][0]?._value.toFixed(0)} kW</h6>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Feeder 2</div>
                <div class="card-body bg-dark-subtle">
                  <h6>{props.itData[1][0]?._value.toFixed(0)} kW</h6>
                </div>
              </div>
            </div>
          </div>
          <div class="row gx-2">
            <div class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Status</div>
                <div class="card-body bg-dark-subtle">
                  <Show
                    when={props.itData[0][0]?._value > 0}
                    fallback={
                      <Show when={props.itData[0][0]?._value <= -1} fallback={<h6>-</h6>}>
                        <h6>Charging</h6>
                      </Show>
                    }
                  >
                    <h6>Discharging</h6>
                  </Show>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Status</div>
                <div class="card-body bg-dark-subtle">
                  <Show
                    when={props.itData[1][0]?._value > 0}
                    fallback={
                      <Show when={props.itData[1][0]?._value <= -1} fallback={<h6>-</h6>}>
                        <h6>Charging</h6>
                      </Show>
                    }
                  >
                    <h6>Discharging</h6>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
