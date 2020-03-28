<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    goToHome () {
      if (!this.$v.$invalid) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<template>
  <main>
    <section>
      <label>Email</label>
      <input 
        type="text" 
        @blur="$v.email.$touch()"
        v-model="email"
        :class="{invalid: $v.email.$error}"
      >
      <label>Password</label>
      <input 
        type="password" 
        @blur="$v.password.$touch()"
        v-model="password"
        :class="{invalid: $v.password.$error}"
        @keyup.enter="goToHome"
      >
      <button
        @click="goToHome"
      >
        Login
      </button>
    </section>
  </main>
</template>

<style scoped>
main {
  background-color: darkgrey;
}

section {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  padding: 70px;
  padding-bottom: 40px;
  border: solid 1px lightgrey;
  border-radius: 8px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 20px;
}

input {
  display: block;
  font-size: 20px;
  margin-bottom: 25px;
  padding: 5px;
  width: 250px;
}

.invalid {
  border: 2px solid red;
}

button {
  font-size: 18px;
  border-radius: 5px;
  padding: 12px;
  background-color: #C4C4C4;
  width: 260px;
  margin: auto;
}
</style>