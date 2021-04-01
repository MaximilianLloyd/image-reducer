import styled from 'styled-components'

export default styled.div`
  height: 100%;
  padding: 20px;

  .content {
    max-width: 1370px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .inputs {
    display: grid;
    grid-template-rows: 1fr;
  }

  canvas {
    border: 1px solid red;

    &.hidden {
      visibility: hidden;
    }
  }

  .file-upload-container {
    margin: 20px 0px;
  }

  .result-image {
    width: 600px;
  }
`
