import { Show } from "solid-js";
import { A } from "@solidjs/router";
import "./Battery.css"; // Assuming you have a CSS file for styles

export default function Battery2(props) {
  const isDataAvailable = (data) => data && data.length > 0;

  const feeders = [
    { index: 0, feeder: 1 },
    { index: 1, feeder: 2 },
  ];

  const metrics = [
    { label: "Active Power", index: 0, unit: "kW" },
    { label: "Reactive Power", index: 4, unit: "kVAR" },
    { label: "Power Factor", index: 3, unit: "" },
    { label: "Voltage", index: 5, unit: "V" },
    { label: "Current", index: 1, unit: "A" },
  ];

  return (
    <div class="card-body bg-dark">
      <div class="row gx-2">
        <For each={feeders}>
          {(feeder) => (
            <div class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Feeder {feeder.feeder}</div>
                <div class="card-body bg-dark">
                  <Show when={isDataAvailable(props.itData[feeder.index])} fallback={<h5 class="text-center text-light">Loading</h5>}>
                    <For each={metrics}>
                      {(metric) => (
                        <div class="card rounded-0 mb-2">
                          <div class="card-header bg-dark text-light">{metric.label}</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {props.itData[feeder.index][metric.index]?._value.toFixed(0)} {metric.unit}
                            </h6>
                          </div>
                        </div>
                      )}
                    </For>
                  </Show>
                </div>
              </div>
            </div>
          )}
        </For>
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
    </div>
  );
}
