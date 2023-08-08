import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (password: string) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return Promise.reject(err)
    else return Promise.resolve(isMatch)
  })
}

export const User = mongoose.model('User', userSchema)
