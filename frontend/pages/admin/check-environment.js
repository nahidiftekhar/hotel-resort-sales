import React from 'react'

function CheckEnv() {
  return (
    <div>
        {process.env.NODE_ENV}
    </div>
  )
}

export default CheckEnv