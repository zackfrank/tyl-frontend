<script>
import { mapActions } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: '',
      authFailed: false
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
    ...mapActions(['login']),
    async tryLogin() {
      if (!this.$v.$invalid) {
        try {
          await this.login({ user: { email: this.email, password: this.password } })
          this.$router.push({ name: 'home' })
        } catch (error) {
          this.authFailed = true
        }
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
        v-model="password"
        :class="{invalid: $v.password.$error}"
        @keyup.enter="tryLogin"
      >
      <div class="validations" v-if="$v.password.$error">
        <p class="validation" v-if="!$v.password.required">
          This ain't gonna work without a password, genius...
        </p>
      </div>
      <button
        @click="tryLogin"
      >
        Login
      </button>
      <div class='auth-failed' v-if='authFailed'>
        Something went wrong
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
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

.auth-failed {
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
</style>