"use client";
/*
 * Documentation:
 * Line Chart — https://app.subframe.com/65982c8dc629/library?component=Line+Chart_22944dd2-3cdd-42fd-913a-1b11a3c1d16d
 */

import React from "react";
import * as SubframeUtils from "../utils";
import * as SubframeCore from "@subframe/core";

interface LineChartRootProps
  extends React.ComponentProps<typeof SubframeCore.LineChart> {
  className?: string;
}

const LineChartRoot = React.forwardRef<HTMLElement, LineChartRootProps>(
  function LineChartRoot(
    { className, ...otherProps }: LineChartRootProps,
    ref
  ) {
    return (
      <SubframeCore.LineChart
        className={SubframeUtils.twClassNames("h-80 w-full", className)}
        ref={ref as any}
        colors={[
          "#2f6e3b",
          "#193921",
          "#46a758",
          "#1d4427",
          "#55b467",
          "#245530",
        ]}
        dark={true}
        {...otherProps}
      />
    );
  }
);

export const LineChart = LineChartRoot;
