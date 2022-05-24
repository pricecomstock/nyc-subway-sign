<script>
  export let show = false;
</script>

{#if show}
  <div class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <slot><!-- optional fallback -->asdasd</slot>
    </div>
  </div>
{/if}

<style>
  .modal {
    display: flex;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto;
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
  }

  .modal-content {
    border-radius: 2rem;
    background-color: #fefefe;
    margin: 10% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;

    width: 80%; /* Could be more or less, depending on screen size */
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 3rem;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
