import { Component, Input, ElementRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements OnInit {

  @Input() data: PieChartData; // not used yet
  @Input() width = 200; // default value
  @Input() height = 200;

  svg; hostElement; radiusSizes;
  durations = {
    entryAnimation: 2000,
    easeBounce: 500
  };
  currentData = [48, 21, 65, 30, 16, 2];

  constructor(private elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit() {
    const radius = this.height / 2;
    this.radiusSizes = {
      innerRadius: radius - 35,
      outerRadius: radius - 10,
      onHoverRadius: radius
    };
    this.drawChart();
  }

  private drawChart(): void {

    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', `${this.width}px`)
      .attr('height', `${this.height}px`)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    const arc = d3.arc()
      .innerRadius(this.radiusSizes.innerRadius)
      .outerRadius(this.radiusSizes.outerRadius);

    const pie = d3.pie()
      .sort(null);

    // used color palette
    const color = d3.scaleOrdinal()
    .domain(this.currentData).range(d3.schemeSet3);

    const angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()());

    const arcs = this.svg
    .selectAll('.arc')
      .data(pie(this.currentData))
      .enter().append('path')
      .attr('class', 'arc');

    // Entry animation
    arcs.transition().duration(this.durations.entryAnimation)
      .attrTween('d', d => {
        const originalEnd = d.endAngle;
        return t => {
          const currentAngle = angleInterpolation(t);
          if (currentAngle < d.startAngle) {
            return '';
          }
          d.endAngle = Math.min(currentAngle, originalEnd);

          return arc(d);
        };})
        .attr('fill', (d,i) => color(i))
        // Important line below -> pointer-events: auto
        .transition().attr('pointer-events', 'auto');

    this.handleMouseEvents();
  }

  handleMouseEvents(): void {
    const pieChartComponent = this;

    d3.selectAll('path.arc')
    // Important line below -> pointer-events: none; prevents from interrupting mouse events during initial animation.
    .attr('pointer-events', 'none')
      .on('mouseover', function(d) {
        // setting cursor
        d3.select(this).style('cursor', 'pointer');
        // animation on hover
        pieChartComponent.pathAnimationOnHover(d3.select(this));
      })
      .on('mouseout', function(d) {
        d3.select(this).style('cursor', '');
        // animation
        pieChartComponent.pathAnimationOnHover(d3.select(this), false);
      });
  }

  pathAnimationOnHover(path: any, isMouseOn: boolean = true): void {
    switch (isMouseOn) {
      case false:
          path.transition()
              .duration(this.durations.easeBounce)
              .ease(d3.easeBounce) // Pass in the easing function d3 v4
              .attr('d', d3.arc()
                  .innerRadius(this.radiusSizes.innerRadius)
                  .outerRadius(this.radiusSizes.outerRadius)
              );
          break;

      case true:
          path.transition()
              .attr('d', d3.arc()
                  .innerRadius(this.radiusSizes.innerRadius)
                  .outerRadius(this.radiusSizes.onHoverRadius)
              );
          break;
  }
  }

}

// move to another file
export interface PieChartData {
  series: PieChartSerie[];
}

export interface PieChartSerie {
  value: number;
  color: string;
}
