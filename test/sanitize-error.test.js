const sanitizeError = require('../lib/sanitize-error')

const possibleErrors = [
  {
    name: 'Visma - Unable to connect to the remote server',
    filePath: 'D:\Scripts\DUST\scripts\Get-DUSTVisma.ps1',
    error: `Invoke-RestMethod : Unable to connect to the remote server
    At D:\Scripts\DUST\scripts\Get-DUSTVisma.ps1:40 char:20
    + ... L]$result = Invoke-RestMethod -Uri "$($visma.baseUri)/ssn/$EmployeeNu ...
    +                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebExc 
       eption
        + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
     
    `,
    expected: 'Invoke-RestMethod : Unable to connect to the remote server'
  },
  {
    name: 'SDS - Method on a null-valued expression',
    filePath: 'D:\Scripts\DUST\scripts\Get-DUSTSds.ps1',
    error: `You cannot call a method on a null-valued expression.
    At D:\Scripts\DUST\scripts\Get-DUSTSds.ps1:261 char:9
    +     if ($_.enrollments.GetType().Name -eq "Hashtable") {
    +         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (:) [], RuntimeException
        + FullyQualifiedErrorId : InvokeMethodOnNull`,
    expected: 'You cannot call a method on a null-valued expression.'
  },
  {
    name: 'SDS - Method on a null-valued expression 2',
    filePath: 'D:\Scripts\DUST\scripts\Get-DUSTSds.ps1',
    error: `You cannot call a method on a null-valued expression.
    At D:\Scripts\DUST\scripts\Get-DUSTSds.ps1:261 char:9
    +     if ($_.enrollments.GetType().Name -eq "Hashtable") {
    +         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (:) [], RuntimeException
        + FullyQualifiedErrorId : InvokeMethodOnNull
     
    You cannot call a method on a null-valued expression.
    At D:\Scripts\DUST\scripts\Get-DUSTSds.ps1:261 char:9
    +     if ($_.enrollments.GetType().Name -eq "Hashtable") {
    +         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (:) [], RuntimeException
        + FullyQualifiedErrorId : InvokeMethodOnNull
     
    `,
    expected: 'You cannot call a method on a null-valued expression.'
  }
]

possibleErrors.forEach(({ name, expected, filePath, error }) => {
  test(`'${name}' :: Expecting '${expected}'`, () => {
    const sanitizedError = sanitizeError(filePath, error)
    expect(sanitizedError).toEqual(expected)
  })
})
