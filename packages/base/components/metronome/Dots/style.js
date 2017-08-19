export default `
  .root:after {
    content: ' ';
    display: table;
    height: 0;
    clear: both;
  }
  .beat {
    float: left;
    line-height: 2.25rem;
    vertical-align: middle;
    padding: 0 3px;
  }
  .circle {
    height: 1.75rem;
    width: 1.75rem;
    border-radius: 50%;
    line-height: 1.75rem;
    vertical-align: middle;
  }
`