<script>
export default { }
</script>

<template>
  <section>
    <div class="search">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Search Cards..."
        autocomplete="off" 
      >
      <button id="searchButton">Search</button>
    </div>
    <div id="sort-section">
      Sort By:
      <div class="sort-options">
        <div class="option">Date Created</div>
        <div class="option">Date Updated</div>
        <div class="option">Title</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 18%;
  float: left;
  border-right: 1px solid grey;
  height: 80vh;
}

.search {
  border: solid 1px grey;
  height: 35px;
  width: 95%;
  border-radius: 3px;
}

#searchInput {
  border: none;
  height: 85%;
  margin: 1px;
  outline: none;
  margin-left: 10px;
  width: 68%;
  font-size: 16px;
}

#searchButton {
  border: none;
  outline: none;
  color: grey;
  font-size: 14px;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    color: black;
  }
}

#sort-section {
  margin-top: 10px;
  color: grey;
}

.sort-options {
  margin-top: 2px;
  margin-left: 10px;
}

.option {
  cursor: pointer;
  &:hover {
    color: black;
  }
}
</style>
