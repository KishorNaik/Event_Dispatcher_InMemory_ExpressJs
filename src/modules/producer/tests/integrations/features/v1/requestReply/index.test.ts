import request from 'supertest';
import expect from 'expect';
import { beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { ValidateEnv } from '@kishornaik/utils';
import { RequestReplyRequestDto } from '@/modules/producer/apps/features/v1/requestReply/contract';
import { runEventDispatcherWorker } from '@/workers/eventDispatcher';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App();
appInstance.initializeProcessExceptionHandling();
appInstance.initializeMiddlewares((app) => {});
appInstance.initializeRestApiRoutes();
appInstance.initializeErrorHandling();
const app = appInstance.getServer();

describe(`create_user_endpoint_integration_test`, () => {
	beforeEach(async () => {
		// Run Event Dispatcher Worker
		await runEventDispatcherWorker();
	});

	/*
  Command:
  node --trace-deprecation --test --test-name-pattern='should_return_200_when_api_is_called' --require ts-node/register -r tsconfig-paths/register ./src/modules/producer/tests/integrations/features/v1/requestReply/index.test.ts
  */
	it(`should_return_200_when_api_is_called`, async () => {
		// Request Dto
		const requestDto = new RequestReplyRequestDto();
		requestDto.fullName = 'kishor naik';
		requestDto.email = 'kn@example.com';

		const response = await request(app)
			.post('/api/v1/request-reply')
			.send(requestDto)
			.set('Accept', 'application/json');
		if (response.status !== 200) {
			console.error('Response:', JSON.stringify(response.body, null, 2));
			setTimeout(() => {
				process.exit(0);
			}, 5000);
			expect(true).toBe(false);
		}

		setTimeout(() => {
			process.exit(0);
		}, 5000);
		expect(response.status).toBe(200);
	});
});
