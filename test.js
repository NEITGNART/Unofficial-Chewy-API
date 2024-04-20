import fetch from 'node-fetch';

const response = 
await fetch('https://www.maybank2u.com.my/home/m2u/common/mbbPortalAccess.do', {
    method: 'POST',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://www.maybank2u.com.my',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://www.maybank2u.com.my/home/m2u/common/login.do',
        'Cookie': '_abck=7FD9FB6866B172AFDEE23B1DA289F02E~0~YAAQ0nw2F5DD1MuOAQAAUmdS4gur8SfcTBC7ghgIttprGjzH/BrRdb1XdyjtiMwn3EPJp0VkqaGgqFb6m/T+xB+8FW2iym74qRCIBIXiyXLuiNgQj2l5Pag5nnZjUMOabK4htbhE4EJKuiniJvFWVzTmoNixqWZZGLRkaisFzjNrxaBoFf98+ncbH8v/6801NtheZf2RBuh/IEoSd7oImPEYFiiRsiKnPjFSscF58fUcddU/oBNTg8q5PFnEoHCuOfpAQgiBo+miLC9Wa740++qkrsYfsTC5laOFCmY4r5VdRWmwW7t5XnWAloyiTCJyHINS8UMzSescJO9kA7WgoELAfeBDpVmMNoyhzUKDE9ZHF0w3jc943B7/uy5yKByckofHLWWrt3T6Kg8K42zIIA1l6bH2podx0xwYase1CxBCwcgO9tBJBiJl~-1~-1~-1; visid_incap_2497266=UG27rQDhR0qQbxGc7+iOTUqpHGYAAAAAQUIPAAAAAAAfMkaFqyCBh72YRyOvlH8s; PMData=PMV6Eeb9SMGS28briB1liOsOeEznxYsZjDo%2FsTmm8GqBNePd8TWLO%2FjFUWMonuXAfCv8%2FrC0lEWB9EDo82vgNdtm4utw%3D%3D; websrcsite=m003; JSESSIONID=E0jiTfnD74wKYzmcWYcf8jNgYUNGIfttjbDCS-34WP4cq3H4wYg3!-1147316063; JROUTE=z877UlLFVQlKNv12; nlbi_2497266=ZWpZFWabxRJxyVB0+b6w3wAAAADFt/Zt7PJ0TnIytxLgDLid; incap_ses_1139_2497266=+rC1WDsDrFAWZATIe4rOD3O6HGYAAAAAcH7FHOv5p8ipKwZ+6kAuRA==; incap_ses_1671_2497266=6TF+Yu+zWU+QlCE0qpUwF426HGYAAAAAfxBbUqUJPKO4CU+lDj5iwQ==; incap_ses_1132_2497266=oNovI/uv/1kiqRVJBay1D5m6HGYAAAAADq4kEHNPkWyQLNg6CbJp1w==; incap_ses_1135_2497266=sZiAWKXKzXRYbQzjflTAD1q9HGYAAAAA719+Zj2ID699DnVFclMpbw==; incap_ses_1136_2497266=575qUKZHoB1Ru8mH/eHDDxNDHWYAAAAAX7I9WU7msx/HxBVIphcAQA==; incap_ses_1129_2497266=vrlZVdu4KRhtxC1biQOrDxa/HGYAAAAAUuHAz+6lHe2U0D+4tjeYYg==; incap_ses_1673_2497266=KqH7bpQy+0i55599p7A3F+vCHGYAAAAAbbjXJ4+ZvEC3UNeaF5yTNA==; bm_sz=2BB933BF0C2EB4F03BA27DC451355F14~YAAQ0nw2F5HD1MuOAQAAUmdS4hc7cxable4d+fbnq7nAZYd9CaIDcf1CyJftJrhsvXy2eh1l9AS5t2H75y9AVkcr4W3BjbZV84D0loywTE88y5CeQT+MRyvnjNzMGjvUlw9LS3uFSguyp2sZ2b9yLGTOhriZAgYwNStftJjMaCczFAwQ5rGmRTEwvUbdCFNR3/585GmM2Y8G71J77wgm1IlWsK5cp+4PA2VZNslKIak1DykbDkRdtLD9/9u0qxl9DhgEQbaYR+gZJzdheLWBIYdOn02HhBkvbd78UwK0qEQmabOemwAaOq15NCf1dUv/a/sII+IQI+Su/GFA/mg3n6z7LQ7hHW223GQAuMnjPjoLf15RBzFcX8UMXL2z0O58YKMdcb0XIuFKE+eozRiksUNhIOAvI7CYbLSzJHwVyYsd2MY5pOW7rg==~4339526~3487289; ak_bmsc=F0E2A9C6647EC07907D4FECDEE5AB8AA~000000000000000000000000000000~YAAQ0nw2Fw7w08uOAQAACvFN4hdiLa7d6GXf/0v6YChI0CqlrkqWim/hCfowIB2RzBShNxH5U5TzNbWuhlCtFF3evpmQ3QT4RTy92hTdzEy+abJVj8EA81LcOpagx5mZste8KLanp4RPQSp2qRn66SsBXIF4zQMQEoNjBzuFP6GgvCa2xuhjiuIP5spTUCGgbxySyq5fupQ2yWWv45dLFOB3G4mBZxVQDHkS8kGeENiWb7BhUH+eZWUrAG24d68LSbxmVEmK9xTPSnCYUMg8zZcHHzJpiPECgKNClNKCXFiA9c1MfJH/0wH0WAp3sBHgbQc5oslOlxYi4xPyeVZ/q2g7OJZvuo5jsxyjMTGWif4DPEyT/KQP6OqfIJWIGhXElg==; bm_mi=656C6EF587CF95C7316236B791FF93CF~YAAQ0nw2F1q11MuOAQAAxhpS4hdNogDIMxd/YHbOw9xBcjh3o9qBlAqzDVxXumOT2qhDyZ/mWhXIkije9tcu5k0ZZz4UsNUD2kiHZykk+rcVTKkEErBsPVKj0XJhoayHs/5zTXW1OiTLGCl/1lBTeQGlfIACWh4/c/bhKuaupQTyQog8qi6aeK9rbwjCKqwPuPEeSVNsIKj3LVlgQHfL5jn5kwhaeKhwUKCa+gfTW4qBw/IkHfAFG8WI2APpAHKaEwqCNbpWHF4r2fJIMZRA6WOz9z+p4ET55G7n67O8xaOkTmo1Z2JnBnD2m4FdYsfP5bpoVTidkrABplzi7qdMOnQ35Q2AuHigeD/f5A==~1; bm_sv=D9D4493B50BD42259F8732D6C05D2496~YAAQ0nw2Fze61MuOAQAABjlS4hczO1b6Bq+7YvPrpkQIa7Lmk9cO3EeVusbGPzxRCpe++cGAwOIhzdusDhRR4ucm+XVihbPoFmpbD0tidhrT0vIlBoWYqx8+BJpKXFfeReXmUDAI8/wP1FN0+uVMqVz6xXIkfb/2Jft7SA+Tnd4te64byFD8AAPRcfWq18WioxATOyDnRzdfQFv6v0RHMicHj1bjUaFyTSVi2cip1YXuOVXkGYiYdIdw9RQapPKl+em0aO6+Aw==~1; incap_ses_1137_2497266=L+SzcuY8vGmIvul+fm/HDyNEHWYAAAAA6AEcufA/ikMQUwhrtV0dUQ==',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1'
    },
    body: new URLSearchParams({
        'json': 'true',
        'action': 'login'
    })
});
const jsonObject = await response.json();
console.log(jsonObject);