import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  // workaround for syntax conflict (TypeScript type assignment and JavaScript property declaration)
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    console.log("Conectando no MongoDB...", uri);

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conexão estabelecida!");
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    const collection = await this.client.db().collection(name);
    return collection;
  },

  map: (collection: any): any => {
    const { _id, ...rest } = collection;

    return {
      id: _id,
      ...rest,
    };
  },
};
