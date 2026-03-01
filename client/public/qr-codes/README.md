# QR Code Images

Place your QR code images in this folder.

## File Naming Convention

Name your QR code images as:
- `qr1.png`
- `qr2.png`
- `qr3.png`
- `qr4.png`
- `qr5.png`

Or update the `qrCodes` array in `client/src/components/Deposit.jsx` to match your file names.

## Supported Formats

- PNG (recommended)
- JPG/JPEG
- SVG

## How It Works

When a user enters a deposit amount and clicks "Generate Payment QR Code", the system will randomly select one of the QR codes from this folder to display.

