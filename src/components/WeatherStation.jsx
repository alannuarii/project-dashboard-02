import { Show } from "solid-js";
import { A } from "@solidjs/router";
import "./WeatherStation.css";

export default function WeatherStation(props) {
  const isDataAvailable = (data) => data && data.length > 0;

  return (
    <div class="card rounded-0 mb-2">
      <A href={`/plts/weatherstation`} class="btn card-header bg-dark text-light">
        Weather Station
      </A>
      <Show when={isDataAvailable(props.wsData)} fallback={<h5 class="text-center text-light">Loading</h5>}>
        <div class="card-body bg-dark">
          <div class="d-flex flex-wrap justify-content-center">
            <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
              <div class="card-header bg-dark text-light">Air Temperature</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[0]?._value.toFixed(0)} {props.units(props.wsData[0]?._field)}
                </h6>
              </div>
            </div>
            <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
              <div class="card-header bg-dark text-light">External Temperature</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[1]?._value.toFixed(0)} {props.units(props.wsData[1]?._field)}
                </h6>
              </div>
            </div>
            <div class="card card-ws rounded-0 mb-2">
              <div class="card-header bg-dark text-light">Global Irradiance</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[2]?._value.toFixed(0)} {props.units(props.wsData[2]?._field)}
                </h6>
              </div>
            </div>
            <div class="card card-ws rounded-0 mb-2">
              <div class="card-header bg-dark text-light">Relative Humidity</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[3]?._value.toFixed(0)} {props.units(props.wsData[3]?._field)}
                </h6>
              </div>
            </div>
            <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
              <div class="card-header bg-dark text-light">Wind Direction</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[4]?._value.toFixed(0)}
                  {props.units(props.wsData[4]?._field)}
                </h6>
              </div>
            </div>
            <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
              <div class="card-header bg-dark text-light text-wrap">Wind Speed</div>
              <div class="card-body bg-dark-subtle">
                <h6>
                  {props.wsData[5]?._value.toFixed(0)} {props.units(props.wsData[5]?._field)}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
