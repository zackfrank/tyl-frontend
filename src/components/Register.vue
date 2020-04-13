<script>
import { mapActions } from 'vuex'
import { required, email, sameAs } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      registrationFailed: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    },
    passwordConfirmation: {
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    ...mapActions(['logInUser']),
    tryRegister() {
      if (!this.$v.$invalid) {
        let params = {
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirmation
        }
        this.axios.post('http://localhost:3000/users', params).then(
          response => {
            this.logInUser(response.data.user)
            this.$router.push({ name: 'home' })
          })
        .catch(() => this.registrationFailed = true)
      }
    }
  }
}
</script>

<template>
  <main>
    <section>
      <h1>Register</h1>
      <label>Email</label>
      <input 
        type="text" 
        @blur="$v.email.$touch()"
        v-model.trim="email"
        :class="{invalid: $v.email.$error}"
        @keyup.enter="tryLogin"
      >
      <div class="validations" v-if="$v.email.$error">
        <p class="validation" v-if="!$v.email.required">
          You need to enter an email homie...
        </p>
        <p class="validation" v-if="!$v.email.email">
          Try entering a valid email dude...
        </p>
      </div>
      <label>Password</label>
      <input 
        type="password" 
        @blur="$v.password.$touch()"
        v-model.trim="password"
        :class="{invalid: $v.password.$error}"
        @keyup.enter="tryRegister"
      >
      <div class="validations" v-if="$v.password.$error">
        <p class="validation" v-if="!$v.password.required">
          This ain't gonna work without a password...
        </p>
      </div>
      <label>Re-enter Password</label>
      <input 
        type="password" 
        @blur="$v.passwordConfirmation.$touch()"
        v-model.trim="passwordConfirmation"
        :class="{invalid: $v.passwordConfirmation.$error}"
        @keyup.enter="tryRegister"
      >
      <div class="validations" v-if="$v.passwordConfirmation.$error">
        <p class="validation" v-if="!$v.passwordConfirmation.required">
          This, uh... needs to be here.
        </p>
        <p class="validation" v-if="!$v.passwordConfirmation.required">
          This doesn't match the password above.
        </p>
      </div>
      <button
        @click="tryRegister"
      >
        Sign Up
      </button>
      <div class='registration-failed' v-if='registrationFailed'>
        Something went wrong
      </div>
      <div class="login">
        <router-link to="/login">
          Already have an account?
        </router-link>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  background-color: darkgrey;
}

h1 {
  margin: 0;
  font-size: 32px;
  color: #55108B;
  opacity: 0.4;
}

section {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  padding: 70px;
  padding-top: 35px;
  padding-bottom: 40px;
  border: solid 1px lightgrey;
  border-radius: 8px;
}

label {
  margin-top: 25px;
  display: block;
  margin-bottom: 8px;
  font-size: 20px;
}

input {
  display: block;
  font-size: 20px;
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
  background-color: #55108B;
  width: 260px;
  margin: auto;
  margin-top: 25px;
  cursor: pointer;
  opacity: 0.4;
    &:hover {
    opacity: 0.7;
  }
}

.registration-failed {
  color: red;
  margin-top: 15px;
}

.validations, .validation {
  margin: 0;
  color: red;
}

.validations {
  margin-top: 4px;
}

.login {
  margin-top: 4px;
  opacity: 0.4;
  &:hover {
    opacity: 0.7;
  }
}
</style>