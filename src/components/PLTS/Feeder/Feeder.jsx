import { Show } from "solid-js";
import "./Feeder.css";

export default function Feeder(props) {
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
      <div class="mb-2">
        <h5 class="unit text-light d-block">PLTS Sangihe</h5>
        <Show
          when={props.lvswData[0]?._value !== 0 && props.lvswData[0]?._value !== "N/A"}
          fallback={props.lvswData[0]?._value === 0 ? <span class="badge rounded-0 text-bg-warning">Standby</span> : <span class="badge rounded-0 text-bg-secondary">Not Available</span>}
        >
          <span class="badge rounded-0 text-bg-success">Operating</span>
        </Show>
      </div>
      <Show when={isDataAvailable(props.lvswData[0]) || isDataAvailable(props.lvswData[1])} fallback={<h5 class="text-center text-light">Loading</h5>}>
        <div class="card rounded-0 mb-2">
          <div class="card-header bg-dark text-light">Active Power</div>
          <div class="card-body bg-dark-subtle">
            <h6>{props.lvswData[0][0]?._value > 0 ? (props.lvswData[0][0]?._value + props.lvswData[1][0]?._value).toFixed(0) : 0} kW</h6>
          </div>
        </div>
        <div class="card rounded-0 mb-2 d-none d-md-block">
          <div class="card-header bg-dark text-light">Reactive Power</div>
          <div class="card-body bg-dark-subtle">
            <h6>{props.lvswData[0][0]?._value > 0 ? (props.lvswData[0][4]?._value + props.lvswData[1][4]?._value).toFixed(0) : 0} kVAR</h6>
          </div>
        </div>
      </Show>
      <div class="row gx-2">
        <For each={feeders}>
          {(feeder) => (
            <div class="col-6">
              <div class="card rounded-0">
                <div class="card-header bg-dark text-light">Feeder {feeder.feeder}</div>
                <div class="card-body bg-dark">
                  <Show when={isDataAvailable(props.lvswData[feeder.index])} fallback={<h5 class="text-center text-light">Loading</h5>}>
                    <For each={metrics}>
                      {(metric) => (
                        <div class="card rounded-0 mb-2">
                          <div class="card-header bg-dark text-light">{metric.label}</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {props.lvswData[feeder.index][metric.index]?._value.toFixed(0)} {metric.unit}
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
    </div>
  );
}
