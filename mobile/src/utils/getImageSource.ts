export const getImageSource = (imageName: string) => {
  switch (imageName) {
    case 'listing-1':
      return require('@/assets/images/listing-1.jpg')
    case 'listing-2':
      return require('@/assets/images/listing-2.jpg')
    case 'listing-3':
      return require('@/assets/images/listing-3.jpg')
    case 'listing-4':
      return require('@/assets/images/listing-4.jpg')
    case 'listing-5':
      return require('@/assets/images/listing-5.jpg')
    case 'listing-6':
      return require('@/assets/images/listing-6.jpg')
    default:
      return require('@/assets/images/listing-1.jpg')
  }
}
