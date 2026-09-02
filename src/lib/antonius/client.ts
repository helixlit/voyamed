import { ArticleReturn } from "./types";

export class AntoniusClient {
  constructor(
    private readonly baseUrl: string,
    private readonly username: string,
    private readonly password: string,
  ) {}

  private async request<T>(
    path: string,
    params?: Record<string, string | number>,
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);

    Object.entries(params ?? {}).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    console.debug(`Fetching ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.username}:${this.password}`,
        ).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Antonius Api returned ${response.status}`);
    }

    return response.json();
  }

  async getArticelTotal() {
    const articleReturn = await this.request<ArticleReturn>(
      "/abdarest/articles",
      {
        skip: 0,
        take: 1,
      },
    );
    return articleReturn.meta.total;
  }

  async getArticleReturn(
    options: {
      skip?: number;
      take?: number;
      since?: string;
      pzn?: string;
    } = {},
  ) {
    return this.request<Antonius.ArticleReturn>("/abdarest/articles", {
      skip: options.skip ?? 0,
      take: options.take ?? 100,
      since: options.since ?? "1970-01-02 00:00:00",

      ...(options.pzn && {
        pzn: options.pzn,
      }),
    });
  }

  async getCategories(
    options: {
      skip?: number;
      take?: number;
      since?: Date;
    } = {},
  ) {
    return this.request<CategoryResponse>("/abdarest/categories", {
      skip: options.skip ?? 0,
      take: options.take ?? 100,
      since:
        options.since?.toISOString().replace("T", " ").substring(0, 19) ??
        "1970-01-02 00:00:00",
    });
  }

  async getImageList(
    options: {
      since?: Date;
      skip?: number;
      take?: number;
    } = {},
  ) {
    return this.request<ImageListResponse>(
      "/abdarest/articleZippedImagesList",
      {
        skip: options.skip ?? 0,
        take: options.take ?? 100,
        since:
          options.since?.toISOString().replace("T", " ").substring(0, 19) ??
          "1970-01-02 00:00:00",
      },
    );
  }

  async downloadImages(since?: Date) {
    const url = new URL("/abdarest/articleZippedImages", this.baseUrl);

    if (since) {
      url.searchParams.set("since", since.toISOString());
    }

    const response = await fetch(url, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${this.username}:${this.password}`).toString("base64"),
      },
    });

    if (!response.ok) throw new Error("Image download failed");

    return response.arrayBuffer();
  }
}
