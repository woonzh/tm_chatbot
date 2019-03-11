export default async function uploadFileToProduct(file, id) {
  const { actions, apis } = global;
  if (file)
    if (id)
      await actions.api({
        ...apis.application.upload,
        upload: file,
        path: [id]
      });
    else {
      const { store } = global;
      const product = store.getState().Product.detail;
      if (product)
        await actions.api({
          ...apis.application.upload,
          upload: file,
          path: [product.id]
        });
    }
}
