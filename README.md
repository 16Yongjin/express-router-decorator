# 데코레이터를 활용한 Express 라우터 생성

- 참고한 포스트: [How to Create Express Router Decorators with TypeScript](https://javascript.plainenglish.io/how-to-write-simple-router-decorators-for-expressjs-with-typescript-3b8340b4d453)

## 개요

데코레이터가 달린 컨트롤러를 구현하면

```ts
@Controller('/cats')
export class CatController {
  private cats: Array<{ name: string }> = [{ name: 'Tom' }, { name: 'Kitty' }];

  @Get('')
  public index(req: Request, res: Response): void {
    res.json({ cats: this.cats });
  }

  @Post('')
  public add(req: Request, res: Response): void {
    this.cats.push(req.body);
    res.status(204).json();
  }

  @Get('/:name')
  public findByName(req: Request, res: Response): unknown {
    const { name } = req.params;
    const foundCat = this.cats.find((c) => c.name === name);
    if (foundCat) {
      return res.json({ cat: foundCat });
    }

    return res.status(404).json({ message: 'Cat not found!' });
  }
}
```

서버 시작 시 라우터로 등록됨

```text
┌────────────┬─────────────────────────┬──────────────────────────────────────┐
│ (index) │        api        │          handler           │
├────────────┼─────────────────────────┼──────────────────────────────────────┤
│    0    │    'GET /cats'    │   'CatController.index'    │
│    1    │   'POST /cats'    │    'CatController.add'     │
│    2    │ 'GET /cats/:name' │ 'CatController.findByName' │
└────────────┴─────────────────────────┴──────────────────────────────────────┘
```

## 파일 설명

### 데코레이터

#### [`utils/controller.decorator.ts`](src/utils/controller.decorator.ts)
- 컨트롤러 데코레이터
- 클래스 상단에 추가
- 기본경로를 지정할 때 사용

#### [`utils/handler.decorator.ts`](src/utils/handler.decorator.ts)
- 메서드 데코레이터
- 메서드 상단에 추가
- HTTP 메서드와 세부 경로를 지정할 때 사용

### 컨트롤러

#### [`controllers/cat.controller.ts`](src/controllers/cat.controller.ts)
- 컨트롤러 구현체
- 클래스와 메서드에 데코레이터가 부착되어있음

### 애플리케이션

#### [`application.ts`](src/application.ts)
- Express 애플리케이션 싱글턴 객체를 반환
- 컨트롤러에 달린 메타데이터 가져와서 라우터에 등록함

### 서버

#### [`server.ts`](src/server.ts)
- Express 애플리케이션을 실행함
