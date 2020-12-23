import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  // workaround for syntax conflict (TypeScript type assignment and JavaScript property declaration)
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }

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
